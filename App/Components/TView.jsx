import { View } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundWrapper from "./BackgroundWrapper";

const ThemeView = ({ style, safe = false, children, ...props }) => {
    if (!safe) {
        return (
            <View style={[style]} {...props}>
                {children}
            </View>
        );
    }

    const insets = useSafeAreaInsets();
    return (
        <BackgroundWrapper
            style={[
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </BackgroundWrapper>
    );
};

export default ThemeView;