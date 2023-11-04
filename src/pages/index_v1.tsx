import { useRef, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ImageItem from '../components/imageitem';

const IndexPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [containerWidth, setContainerWidth] = useState(300);

  const handleRef = useRef(null);
  
  useEffect(() => {
    const handle = handleRef.current;
  
    const onMouseMove = (event) => {
      if (event.buttons !== 1) return;
      setContainerWidth(event.clientX);
    };
  
    handle.addEventListener('mousedown', () => {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', onMouseMove);
      });
    });
  
    return () => {
      handle.removeEventListener('mousedown', onMouseMove);
    };
  }, []);

  const onImageUpload = (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prevImages) => [...prevImages, e.target.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const moveImage = (from: number, to: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      const [removedImage] = updatedImages.splice(from, 1);
      updatedImages.splice(to, 0, removedImage);
      return updatedImages;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <input type="file" multiple accept="image/*" onChange={onImageUpload} />
      <div style={{ display: 'flex', height: '100%' }}>
        <div
          style={{ 
            width: containerWidth, 
            overflow: 'auto', 
            borderRight: '5px solid gray', 
            position: 'relative',
            paddingRight: '10px'
          }}
        >
          {images.map((img, index) => (
            <ImageItem key={index} img={img} index={index} moveImage={moveImage} width={containerWidth} />
          ))}
          <div 
            ref={handleRef}
            style={{ 
              width: '10px', 
              height: '100%', 
              backgroundColor: 'gray', 
              cursor: 'ew-resize', 
              position: 'absolute', 
              right: 0, 
              top: 0
            }}
          ></div>
        </div>
        <div style={{ flex: 1 }}>
          {/* Right side content */}
        </div>
      </div>
    </DndProvider>
  );
};

export default IndexPage;
