# Theme System

## Font Size System

We've implemented a responsive font size system to ensure consistent text sizing across the application. This system allows for easy adjustment of font sizes throughout the app from a single location.

### How it Works

The font size system is defined in `src/theme/fontSizes.js` and uses the `react-native-responsive-fontsize` package to create responsive font sizes that adapt to different screen sizes.

#### Font Size Scale

By default, all font sizes are increased by 15% using the `FONT_SCALE` constant. You can adjust this value to make all text in the app larger or smaller.

#### Available Font Sizes

The system provides the following font size tokens:

```
xs: 10 -> For very small text (with scaling: ~11.5px)
sm: 12 -> For small labels (with scaling: ~13.8px)
md: 14 -> For regular body text (with scaling: ~16.1px)
lg: 16 -> For emphasized body text (with scaling: ~18.4px)
xl: 18 -> For subtitles (with scaling: ~20.7px)
xxl: 20 -> For small headings (with scaling: ~23px)
title: 22 -> For section titles (with scaling: ~25.3px)
heading: 24 -> For page headings (with scaling: ~27.6px)
displaySm: 28 -> For medium displays (with scaling: ~32.2px)
display: 32 -> For large displays (with scaling: ~36.8px)
```

### Usage

#### In Style Sheets

Import the font size utility:

```javascript
import { fontSize } from '../../theme/fontSizes';

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize.heading,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: fontSize.md,
  }
});
```

#### In Inline Styles

```javascript
import { fontSize } from '../../theme/fontSizes';

<Text style={{ fontSize: fontSize.lg }}>
  Some text with larger font size
</Text>
```

#### Adjusting Font Sizes App-Wide

To increase or decrease all font sizes throughout the app, simply modify the `FONT_SCALE` constant in `src/theme/fontSizes.js`.

```javascript
// Scale factor to increase or decrease all font sizes
const FONT_SCALE = 1.15; // Increase font size by 15%
```

### Theme Integration

The font sizes are also available through the theme object:

```javascript
const Component = () => {
  const theme = useTheme();
  
  return (
    <Text style={{ fontSize: theme.fontSize.md }}>
      Text using theme
    </Text>
  );
};
``` 