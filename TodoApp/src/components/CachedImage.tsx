import React, { useState, useEffect, useRef } from 'react';
import { Image, ImageProps, ActivityIndicator, View, StyleSheet } from 'react-native';
import { cacheImage } from '../utils/cacheUtils';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string } | number;
  placeholderColor?: string;
}

const CachedImage: React.FC<CachedImageProps> = ({ 
  source, 
  style, 
  placeholderColor = '#e1e2e3',
  ...props 
}) => {
  const [imageSource, setImageSource] = useState<{ uri: string } | number>(
    typeof source === 'number' ? source : { uri: '' }
  );
  const [loading, setLoading] = useState(true);
  const loadedFromCache = useRef(false);

  useEffect(() => {
    let isMounted = true;
    loadedFromCache.current = false;
    setLoading(true);

    const loadImage = async () => {
      if (typeof source !== 'number') {
        try {
          const cachedUri = await cacheImage(source.uri);
          
          if (isMounted) {
            setImageSource({ uri: cachedUri });
            // Only set loading to false here if the image is from cache
            // This prevents race condition with onLoad event
            loadedFromCache.current = true;
            setLoading(false);
          }
        } catch (error) {
          console.error('Error loading cached image:', error);
          if (isMounted) {
            setImageSource(source); // Fallback to original source
            setLoading(false);
          }
        }
      } else {
        // Local image resource
        if (isMounted) {
          setImageSource(source);
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [source]);

  // Handle image load event
  const handleImageLoad = () => {
    // Only set loading to false if it wasn't already set by the cache loading
    if (!loadedFromCache.current) {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View 
          
          
          
          
          
          style={[styles.placeholder, { backgroundColor: placeholderColor }, style]}
          testID="cached-image-loading"
        
          testID="cached-image-loading"
        
          testID="cached-image-loading"
        
          testID="cached-image-loading"
        
          testID="cached-image-loading"
        
          testID="cached-image-loading"
        >
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}
      <Image
        {...props}
        source={imageSource}
        style={[
          style,
          loading ? { opacity: 0 } : { opacity: 1 }
        ]}
        onLoad={handleImageLoad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CachedImage;