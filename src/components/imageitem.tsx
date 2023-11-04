import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const imageType = 'IMAGE';

const ImageItem = ({ img, index, moveImage, width }) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: imageType,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: imageType,
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <img
      ref={ref}
      src={img}
      alt={`img-${index}`}
      width={width - 20} // 너비를 조절합니다
      style={{ margin: '10px', opacity: isDragging ? 0.5 : 1 }}
    />
  );
};

export default ImageItem;
