#!/bin/bash

# Directory containing avatars
AVATAR_DIR="public/images/avatars"
THRESHOLD_SIZE=500000 # 500KB

echo "🎨 optimizing Avatars in $AVATAR_DIR..."

# Find all PNGs larger than 500KB
find "$AVATAR_DIR" -name "*.png" -size +500k | while read -r file; do
    filename=$(basename "$file")
    echo "Compressing $filename..."

    # Resize to max 400px width/height and re-save
    sips -Z 400 "$file" > /dev/null

    # Check new size
    new_size=$(stat -f%z "$file")
    if [ "$new_size" -lt "$THRESHOLD_SIZE" ]; then
        echo "✅ Safe: $filename is now $(($new_size / 1024))KB"
    else
        echo "⚠️ Still large: $filename is $(($new_size / 1024))KB. Trying JPEG conversion..."
        # If still too big, convert to JPG
        sips -s format jpeg -s formatOptions 80 "$file" --out "${file%.*}.jpg" > /dev/null
        rm "$file"
        echo "🔄 Converted to JPG: ${filename%.*}.jpg"
    fi
done

echo "✨ Optimization complete."
