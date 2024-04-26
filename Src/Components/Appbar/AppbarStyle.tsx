import { StyleSheet } from 'react-native'
import colors from '../../Constants/colors'
import { scale } from 'react-native-size-matters'

export default StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: scale(15),
        backgroundColor: colors.appBackgroundColor
    },
    backIconStyle: {
        position: 'absolute',
        left: 16,
    },
    menuContainerStyle: {
        position: 'absolute',
        right: 0,
    },
    menuIconStyle: {
        height: scale(20),
        width: scale(20),
        tintColor: colors.white
    },
    menuOptionContainerStyle: {
        marginTop: scale(35),
        backgroundColor: colors.black,
        borderRadius: scale(15),
        paddingVertical: scale(10),
        paddingLeft: scale(5)
    },
    menuTitleStyle: {
        color: colors.white,
        // fontFamily: FONTS.Roboto.Regular,
        fontSize: scale(14)
    }
})

 