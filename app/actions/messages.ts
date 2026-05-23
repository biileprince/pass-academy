"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ActionResult } from "@/types";
import type { Message } from "@prisma/client";

const sendSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1, "Message cannot be empty").max(4000, "Message too long"),
  sessionId: z.string().optional(),
});

export async function sendMessage(input: unknown): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  const parsed = sendSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  if (parsed.data.receiverId === session.user.id) {
    return { success: false, error: "Cannot message yourself" };
  }

  try {
    const receiver = await db.user.findUnique({
      where: { id: parsed.data.receiverId },
      select: { id: true },
    });
    if (!receiver) return { success: false, error: "Recipient not found" };

    const message = await db.message.create({
      data: {
        senderId: session.user.id,
        receiverId: parsed.data.receiverId,
        content: parsed.data.content,
        sessionId: parsed.data.sessionId,
      },
    });

    revalidatePath(`/messages/${parsed.data.receiverId}`);
    return { success: true, data: { id: message.id } };
  } catch {
    return { success: false, error: "Failed to send message" };
  }
}

export async function getConversation(
  otherUserId: string
): Promise<ActionResult<Message[]>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated" };

  try {
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      take: 200,
    });

    const unreadIds = messages
      .filter((m) => m.receiverId === session.user.id && !m.isRead)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      await db.message.updateMany({
        where: { id: { in: unreadIds } },
        data: { isRead: true, readAt: new Date() },
      });
    }

    return { success: true, data: messages };
  } catch {
    return { success: false, error: "Failed to load messages" };
  }
}

export async function getMyConversations() {
  const session = await auth();
  if (!session?.user) return { success: false as const, error: "Not authenticated" };

  const userId = session.user.id;

  // All distinct counterparties with last message preview + unread count.
  const messages = await db.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      receiver: { select: { id: true, name: true, image: true } },
    },
    take: 500,
  });

  type Counterparty = { id: string; name: string | null; image: string | null };
  const map = new Map<
    string,
    {
      counterparty: Counterparty;
      lastMessage: string;
      lastAt: Date;
      unreadCount: number;
    }
  >();

  for (const m of messages) {
    const isOutgoing = m.senderId === userId;
    const other: Counterparty = isOutgoing ? m.receiver : m.sender;

    const existing = map.get(other.id);
    if (existing) {
      if (!isOutgoing && !m.isRead) existing.unreadCount += 1;
    } else {
      map.set(other.id, {
        counterparty: other,
        lastMessage: m.content,
        lastAt: m.createdAt,
        unreadCount: !isOutgoing && !m.isRead ? 1 : 0,
      });
    }
  }

  const conversations = Array.from(map.values()).sort(
    (a, b) => b.lastAt.getTime() - a.lastAt.getTime()
  );

  return { success: true as const, data: conversations };
}

export async function getUnreadMessageCount(): Promise<number> {
  const session = await auth();
  if (!session?.user) return 0;
  return db.message.count({
    where: { receiverId: session.user.id, isRead: false },
  });
}
