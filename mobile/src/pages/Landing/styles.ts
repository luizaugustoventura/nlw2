import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#8257E5',
        justifyContent: 'center',
        padding: 40
    },

    banner: {
        width: '100%',
        resizeMode: 'contain'
        /*
            Por padrão, as imagens sempre irão ocupar as suas dimensões originais quando as 
            dimensões desejadas não forem passadas à imagem. Por isso o width 100%, para que ela 
            tenha a largura ou altura de 100% do container.

            Porém, em alguns casos, ao trabalhar as dimensões da imagem desta forma, ela pode ficar
            distorcida, pois ela será esprimida verticalmente, ou horizoontalmente. O 'resideMode'
            serve justamente para redimensionar a imagem proporcionalmente.
            
            Resize modes:
                contain: Redimensiona a imagem e mantém todo seu conteúdo visível
                cover: Redimensiona a imagem, porém corta o excedente
        */
    },

    title: {
        fontFamily: 'Poppins_400Regular',
        color: '#FFF',
        fontSize: 20,
        lineHeight: 30,
        marginTop: 80 //80
    },

    titleBold: {
        fontFamily: 'Poppins_600SemiBold'
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 40,
        justifyContent: 'space-between'
    },

    button: {
        height: 150,
        width: '48%',
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 24,
        justifyContent: 'space-between'
    },

    buttonPrimary: {
        backgroundColor: '#9871F5'
    },

    buttonSecondary: {
        backgroundColor: '#04D361'
    },

    buttonText: {
        fontFamily: 'Archivo_700Bold',
        color: '#FFF',
        fontSize: 20
    },

    totalConnections: {
        fontFamily: 'Poppins_400Regular',
        color: '#D4C2FF',
        fontSize: 12,
        lineHeight: 20,
        maxWidth: 140,
        marginTop: 40
    }
});

export default styles;