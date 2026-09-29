import type { Connection, TapCard } from "../types";

export function orderedCardConnections(
  card: TapCard,
  connections: Connection[],
) {
  const byId = new Map(connections.map((connection) => [connection.id, connection]));
  const saved = card.connectionIds.flatMap((id) => {
    const connection = byId.get(id);
    if (!connection) return [];
    byId.delete(id);
    return [connection];
  });
  const remaining = connections.filter((connection) => byId.has(connection.id));
  const all = [...saved, ...remaining];
  const savedIds = new Set(card.connectionIds);
  const hidden = new Set([
    ...card.hiddenConnectionIds,
    ...connections
      .filter((connection) => !savedIds.has(connection.id))
      .map((connection) => connection.id),
  ]);
  return [
    ...all.filter((connection) => !hidden.has(connection.id)),
    ...all.filter((connection) => hidden.has(connection.id)),
  ];
}

export function toggleCardConnection(card: TapCard, connectionId: string): TapCard {
  const wasSaved = card.connectionIds.includes(connectionId);
  const wasHidden = card.hiddenConnectionIds.includes(connectionId);
  if (!wasSaved) {
    return {
      ...card,
      connectionIds: [...card.connectionIds, connectionId],
      hiddenConnectionIds: card.hiddenConnectionIds.filter((id) => id !== connectionId),
    };
  }
  return {
    ...card,
    connectionIds: card.connectionIds,
    hiddenConnectionIds: wasHidden
      ? card.hiddenConnectionIds.filter((id) => id !== connectionId)
      : [...card.hiddenConnectionIds, connectionId],
  };
}

export function moveCardConnection(
  card: TapCard,
  connectionId: string,
  direction: -1 | 1,
): TapCard {
  if (card.hiddenConnectionIds.includes(connectionId)) return card;
  const visible = card.connectionIds.filter(
    (id) => !card.hiddenConnectionIds.includes(id),
  );
  const from = visible.indexOf(connectionId);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= visible.length) return card;
  const neighborId = visible[to];
  const next = [...card.connectionIds];
  const connectionIndex = next.indexOf(connectionId);
  const neighborIndex = next.indexOf(neighborId);
  [next[connectionIndex], next[neighborIndex]] = [
    next[neighborIndex],
    next[connectionIndex],
  ];
  return { ...card, connectionIds: next };
}
