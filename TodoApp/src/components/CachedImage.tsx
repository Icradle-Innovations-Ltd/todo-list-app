import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (typeof source !== 'number') {
        try {
          setLoading(true);
          const cachedUri = await cacheImage(source.uri);
          
          if (isMounted) {
            setImageSource({ uri: cachedUri });
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

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={[styles.placeholder, { backgroundColor: placeholderColor }, style]}>
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
        onLoad={() => setLoading(false)}
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