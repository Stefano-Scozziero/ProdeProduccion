# ProdeProduccion

Una aplicación de Futbol para los amantes de las timbas.

## Funcionalidades Principales

### Pantalla de Cuenta

- **Acceso seguro:** Solo los usuarios autenticados pueden acceder a la pantalla de perfil y realizar compras.
- **Información del usuario:** Muestra detalles del usuario, como el nombre y la dirección.

| <img src="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/images%2FLogin.png?alt=media&token=f30a26d6-922d-4425-940d-c71baaa261b5" width="300" /> | <img src="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/images%2FRegister.png?alt=media&token=1a38d010-6ac5-448b-8b3a-8ab5c52acf5f" width="300" /> |
|---|---|

### Autenticación con Firebase, Google y Facebook.

- Utiliza el sistema de autenticación de Firebase para gestionar el acceso de usuarios, además de permitir el inicio de sesión con Google y Facebook.
- Permite a los usuarios registrarse e iniciar sesión de manera segura.

### Pantalla de Home

- Muestra una selección de categorías en tarjetas.
- Al seleccionar una categoría, se navega a la pantalla correspondiente.

### Pantalla de Predicciones

- Lista todas las ligas en tarjetas con el nombre y foto correspondientes.
- Permite navegar a la pantalla de predicciones de una liga específica.
- Incluye pickers para seleccionar tanto las fechas como los torneos.
- Los botones de incremento y decremento permiten ajustar y guardar los pronósticos.
- Muestra los resultados y puntos obtenidos en fechas ya jugadas.

| <img src="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/images%2FPredicts.png?alt=media&token=af6eb701-a4f3-4621-8758-65fbb725c669" width="300" /> | <img src="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/images%2FPredicts-Date-Old.png?alt=media&token=122baac0-c62e-4343-a739-7ba6a4f11fa1" width="300" /> | 
|---|---| 
| <img src="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/images%2FFixture.png?alt=media&token=ba31cccd-0384-44fd-98ff-cb107d888422" width="300" /> |


### Pantalla de Fixture

- Proporciona una descripción detallada de cada fecha para cada torneo.

### Pantalla de Tabla de Lideres

- Muestra los puntos de cada equipo y resalta al líder de la tabla.

### Pantalla de Noticias

- Proporciona información detallada de los partidos en tiempo real.

| <img src="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/images%2FDrawer.png?alt=media&token=6d53aec2-de8b-453e-9463-233fbd2e8933" width="300" /> | <img src="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/images%2FForgotYourPass.png?alt=media&token=5e908c50-465f-4023-9bf5-f8fe1c88f677" width="300" /> | 
|---|---| 
| <img src="https://firebasestorage.googleapis.com/v0/b/prodesco-6910f.appspot.com/o/images%2Fprofile.png?alt=media&token=19c381fd-da41-4236-887b-e523b6ffae2d" width="300" /> 



### Navegación Lateral

```Javascript
        const DrawerNavigator = () => {
    
  return (
    
            <Drawer.Navigator
            initialRouteName='ProdeStack'
            screenOptions={{
                headerShown:false,
                animationEnabled: false,
            }}
            drawerContent={props => <CustomDrawerContent {...props} />}
            >
                <Drawer.Screen
                    name='Inicio'
                    component={ProdeStack}
                />
                <Drawer.Screen
                    name='Predicciones'
                    component={PredictionStack}
                />
                <Drawer.Screen 
                    name='Editar Perfil' 
                    component={ProfileStack}
                />
                <Drawer.Screen 
                    name='¿Como Jugar?' 
                    component={HowToPlayStack}
                />
                <Drawer.Screen 
                    name='Administrador' 
                    component={Administrador}
                />
           </Drawer.Navigator>
  )
}

```

- **Pestaña 1 - Inicio:** Contiene las predicciones, el fixture, las noticias y la tabla de líderes.
- **Pestaña 2 - Como jugar?:** Explica cómo comenzar a jugar y usar la aplicación.
- **Pestaña 3 - Notificaciones:** Muestra eventos importantes para los usuarios.
- **Pestaña 4 - Amigos:** Permite ver los amigos conectados.
- **Pestaña 5 - Compartir:** Permite compartir la aplicación mediante un enlace.
- **Pestaña 6 - Editar Perfil:** Información del usuario y carga de imagen de perfil. Ademas cuenta con un boton de borrado de cuenta.
- **Pestaña 7 - Preferencias:** Configuración de preferencias del usuario (ej. tema oscuro).
- **Pestaña 8 - Cerrar Sesion:** Permite cerrar la sesión del usuario.

## Tecnologías Utilizadas

- **Firebase Authentication:** Sistema de autenticación para gestionar la seguridad de la aplicación.
- **React Native Navigation Stack:** Maneja la navegación entre pantallas.
- **React Native Navigation Buttom tap:** Navegación entre pestañas
- **Expo-Picker-Image:** Permite la carga de imágenes de perfil.
- **Redux:** Centraliza y gestiona el estado global de la aplicación.
- **RTK Query y Firebase:** Operaciones de lectura y escritura en la base de datos.

## Instalación

1. Clona el repositorio: `git clone https://github.com/Stefano-Scozziero/ProdeTesting.git`
2. Instala las dependencias: `npm install`
3. Configura las claves de API para servicios externos (Firebase, etc.).
4. Configura las credenciales de Firebase en tu proyecto.
5. Ejecuta la aplicación: `npx expo run:android`

## Contacto

Para preguntas o soporte, contacta a scozzierostefano@gmail.com.