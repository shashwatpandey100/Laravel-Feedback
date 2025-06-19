import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useState } from 'react';

const SortableItem = ({ item, renderItem, disabled, dragHandleClass = 'cursor-grab text-gray-400 hover:text-gray-600' }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
        disabled,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`relative ${isDragging ? 'z-50' : ''}`}>
            <div className="flex items-center gap-4">
                {!disabled && (
                    <div {...attributes} {...listeners} className={`mt-1 ${dragHandleClass}`}>
                        <GripVertical size={18} />
                    </div>
                )}
                <div className="flex-1">{renderItem(item)}</div>
            </div>
        </div>
    );
};

const DraggableList = ({ items, onChange, disabled = false, renderItem, onOrderChange = null, itemClass = '' }) => {
    const [activeId, setActiveId] = useState(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

    const handleDragStart = (event) => {
        if (disabled) return;
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (disabled || !over || active.id === over.id) {
            setActiveId(null);
            return;
        }

        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex !== newIndex) {
            const newItems = arrayMove(items, oldIndex, newIndex);
            onChange(newItems);

            if (onOrderChange && typeof onOrderChange === 'function') {
                const orderedIds = newItems.map((item) => item.id);
                onOrderChange(orderedIds);
            }
        }

        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy} disabled={disabled}>
                <div className={`space-y-3 ${itemClass}`}>
                    {items.map((item) => (
                        <SortableItem key={item.id} item={item} disabled={disabled} renderItem={renderItem} />
                    ))}
                </div>
            </SortableContext>

            <DragOverlay adjustScale={false}>
                {activeItem ? <div className="rounded-md border bg-purple-100 p-2 opacity-100 shadow-lg">{renderItem(activeItem, true)}</div> : null}
            </DragOverlay>
        </DndContext>
    );
};

export default DraggableList;
