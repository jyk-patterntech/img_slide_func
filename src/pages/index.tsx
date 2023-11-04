  import { useRef, useEffect, useState } from 'react';
  import { DndProvider } from 'react-dnd';
  import { HTML5Backend } from 'react-dnd-html5-backend';
  import ImageItem from '../components/imageitem';

  const IndexPage = () => {
    const [images, setImages] = useState([]);
    const [containerWidth, setContainerWidth] = useState(null);
    const [upperHeight, setUpperHeight] = useState(null);

    const verticalHandleRef = useRef(null);
    const horizontalHandleRef = useRef(null);

    // Resize left panel width
    useEffect(() => {

      function setDividers(){
        setContainerWidth(window.innerWidth*0.3)
        setUpperHeight(window.innerHeight*0.3)
      }
      setDividers()
      
      const onMouseMove = (event) => {
        if (event.buttons !== 1) return;
        setContainerWidth(event.clientX);
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
      };

      const handle = verticalHandleRef.current;
      handle.addEventListener('mousedown', () => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp, { once: true });
      });

      return () => {
        window.removeEventListener('mouseup', onMouseUp);
        handle.removeEventListener('mousedown', onMouseMove);
      };
    }, []);

    // Resize upper panel height
    useEffect(() => {
      const onMouseMove = (event) => {
        if (event.buttons !== 1) return;
        const newHeight = event.clientY;
        setUpperHeight(newHeight);
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
      };

      const handle = horizontalHandleRef.current;
      handle.addEventListener('mousedown', () => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp, { once: true });
      });

      return () => {
        window.removeEventListener('mouseup', onMouseUp);
        handle.removeEventListener('mousedown', onMouseMove);
      };
    }, []);

    const onImageUpload = (e) => {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages((prevImages) => [...prevImages, event.target.result]);
        };
        reader.readAsDataURL(file);
      }
    };

    const moveImage = (from, to) => {
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
        <div style={{ display: 'flex', height: '100vh' }}>
          <div
            style={{ 
              width: containerWidth, 
              overflow: 'auto', 
              // borderRight: '5px solid gray', 
              position: 'relative',
              paddingRight: '10px'
            }}
          >
            {images.map((img, index) => (
              <ImageItem key={index} img={img} index={index} moveImage={moveImage} width={containerWidth} />
            ))}
            <div 
              ref={verticalHandleRef}
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
              {/* Right side upper content */}
            </div>
            <div
              ref={horizontalHandleRef}
              style={{
                height: '10px',
                backgroundColor: 'gray',
                cursor: 'ns-resize'
              }}
            ></div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {/* Right side lower content */}
            </div>
          </div>
        </div>
      </DndProvider>
    );
  };

  export default IndexPage;
