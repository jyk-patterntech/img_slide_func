import { useRef, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ImageItem from '../components/imageitem';

const IndexPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth*0.3);
  const [upperHeight, setUpperHeight] = useState(window.innerHeight*0.3); // 상단 컨테이너 높이
  const [lowerHeight, setLowerHeight] = useState(window.innerHeight*0.7); // 하단 컨테이너 높이

  const handleRef = useRef(null);
  const upperPanelRef = useRef(null);
  
  // 왼쪽 패널 너비 조절
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
      }, { once: true });
    });
  
    return () => {
      handle.removeEventListener('mousedown', onMouseMove);
    };
  }, []);

  // 오른쪽 상단 패널 높이 조절
  useEffect(() => {
    const handle = upperPanelRef.current;
    
    const onMouseMove = (event) => {
      if (event.buttons !== 1) return;
      setUpperHeight(event.clientY);
      setLowerHeight(window.innerHeight - event.clientY);
    };
  
    handle.addEventListener('mousedown', () => {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', onMouseMove);
      }, { once: true });
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: upperHeight, overflow: 'auto', borderBottom: '5px solid gray' }}>
            {/* 오른쪽 상단 컨텐츠 */}
          </div>
          <div
            ref={upperPanelRef}
            style={{
              height: '10px',
              backgroundColor: 'gray',
              cursor: 'ns-resize'
            }}
          ></div>
          <div style={{ height: lowerHeight, overflow: 'auto' }}>
            {/* 오른쪽 하단 컨텐츠 */}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default IndexPage;
