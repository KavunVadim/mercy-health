export interface DraggableItem {
  _id?: string;
}

export function handleDragStart(e: React.DragEvent, index: number) {
  e.dataTransfer.setData('text/plain', String(index));
  e.dataTransfer.effectAllowed = 'move';
  const el = e.currentTarget as HTMLElement;
  el.style.opacity = '0.4';
}

export function handleDragOver(e: React.DragEvent, index: number, dragIndex: number | null, onReorder: (from: number, to: number) => void) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  if (dragIndex === null || dragIndex === index) return;
  const el = e.currentTarget as HTMLElement;
  el.style.borderTop = '2px solid #3b82f6';
}

export function handleDragLeave(e: React.DragEvent) {
  const el = e.currentTarget as HTMLElement;
  el.style.borderTop = '';
  el.style.borderBottom = '';
}

export function handleDrop(e: React.DragEvent, index: number, dragIndex: number | null, onReorder: (from: number, to: number) => void) {
  e.preventDefault();
  const el = e.currentTarget as HTMLElement;
  el.style.borderTop = '';
  el.style.borderBottom = '';
  if (dragIndex !== null && dragIndex !== index) {
    onReorder(dragIndex, index);
  }
}

export function handleDragEnd(e: React.DragEvent) {
  const el = e.currentTarget as HTMLElement;
  el.style.opacity = '1';
  el.style.borderTop = '';
  el.style.borderBottom = '';
}

export async function saveReorder(collection: string, items: DraggableItem[]) {
  const ids = items.map(i => i._id).filter(Boolean) as string[];
  try {
    const res = await fetch('/api/admin/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collection, ids }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
