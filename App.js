import React , {useState,useEffect} from "react";
import { Text, View, FlatList, StyleSheet, Image, RefreshControl, Button, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export default function App() {
 const [fruits,setfruits] = useState(null);
 const [refreshing, setRefreshing] = useState(false);
 const Tab = createBottomTabNavigator();
 const [Nombre, setNombre] = useState("");
 const [Validacion_nombre, setvalidacion_nombre] = useState("")
 const [Precio, setPrecio] = useState("");
 const [Validacion_precio, setvalidacion_Precio] = useState("")


 useEffect(()=>{
  getFruits()
 },[])

 const getFruits =() => {
    fetch("http://192.168.137.1:8080/fruits")
    .then(response => response.json())
    .then((response) => {
      console.log("OBTENIENDO DATOS DE LA API FRUTA",response)
      setfruits(response);
    })
    .catch(error => console.log(error));
 }

 function subirFruta() {
  fetch("http://192.168.137.1:8080/fruits",{ 
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          name:  Nombre,
          price: Precio,
      }),
  })

  .then((response) => response.json())
  .then((responseData) => {
      console.log(
          "POST Response",
          "Response Body -> " + JSON.stringify(responseData)
      )
  }).catch()
}

function validacion_campo_nombre(nombre){
    const solo_texto = /[a-zA-ZÁ-ÿ\s]+$/
    if (solo_texto.test(nombre)) {
      console.log("Validacion 1")
      setvalidacion_nombre(true)
    setNombre(nombre)
    } else {setvalidacion_nombre(false)
  }
}

function Validacion_campo_precio(precio){
  const solo_numero = /[0-9\s]+$/
  if (solo_numero.test(precio)) {
    console.log("Validacion 3")
    setvalidacion_Precio(true)
    setPrecio(precio)
  } else {
      setvalidacion_Precio(false)
    }
  }

var imageMap = {
  'Lentejas' : require('./img/Lentejas.jpg'),
  'Pear' : require('./img/Pear.jpg'),
  'Strawberry' : require('./img/Strawberry.jpg'),
  'Tomate' : require('./img/Tomate.jpg'),
  'Kiwi' : require('./img/Kiwi.jpg'),
  'Manzana' : require('./img/Manzana.jpg'),
  'Piña' : require('./img/Piña.jpg'),
}

 const renderItem = ({item}) => (
   <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center' ,padding: 20, margin: 10, backgroundColor: 'white', borderWidth: 5}}>
      <Text style={{ flex: 1, paddingTop: 40, fontSize: 20, textAlign:'center', justifyContent: 'center', color: 'black' }}>{item.name}</Text>
      <Text style={{ flex: 1, paddingTop: 40, fontSize: 20,textAlign:'center', justifyContent: 'center', color: 'black', }}>{item.price}</Text>
      <Image style={{width: 100, height: 100,}} source={imageMap[item.name]}/>
   </View>
 )

 const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  wait(2000).then(() => setRefreshing(false));
}, []);

function HomeScreen({}){
  return(
      <FlatList
      data={fruits}
      renderItem={renderItem}
      keyExtractor={item=>item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
  );
 }

 function AddScreen({}) {
  return (
    <View style ={[styles.aplicacion]}>
       <Text style ={[styles.titulo]}>Inserción de frutas</Text>
       <View style ={[styles.contenedor_datos]}>
        <Text style={{color: 'black', padding: 10}}>Nombre fruta:</Text>
        <TextInput style ={Validacion_nombre ? [styles.cuadrotexto_bien]:[styles.cuadrotexto_mal]}
        name="nombre"
        placeholder="Nombre"
        onChangeText={nombre=>validacion_campo_nombre(nombre)}
        />
        </View>
        
        <View style ={[styles.contenedor_datos]}>
        <Text style={{color: 'black', padding: 10}}>Precio:</Text>
        <TextInput style ={Validacion_precio ? [styles.cuadrotexto_bien]:[styles.cuadrotexto_mal]}
        placeholder="0"
        onChangeText={precio=>Validacion_campo_precio(precio)}
        />
        </View>
      

      <Button onPress={() => subirFruta()} title ='Pulsa aquí para subir la fruta'/>
    </View>
  );
}

   return (
  <NavigationContainer>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Lista') {
            iconName = focused
              ? 'cash'
              : 'cash';
          } else if (route.name === 'Add') {
            iconName = focused ? 'arrow-up-outline' : 'arrow-up-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Lista" component={HomeScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
    </Tab.Navigator>
  </NavigationContainer>
   )
}

const styles = StyleSheet.create({
  titulo:{
    fontSize:40,
    fontWeight: 'bold',
    color:'black',
  },

  aplicacion:{
    alignItems:"center",
  },

  contenedor_datos:{
    justifyContent:"center",
    alignItems:"center",
    padding:30, 
  },
  contenedor_genero:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    padding:30,
    borderWidth:10,
    borderColor:"#FA0505",
    borderRadius:50,
  }, 
  cuadrotexto_bien:{
    backgroundColor:"white",
    color:'black',
    borderColor:'grey',
    borderWidth:1,
    width:300, 
  },

  cuadrotexto_mal:{
    backgroundColor:"white",
    color:'black',
    borderColor:'red',
    borderWidth:1,
    width:300,
  },
    
  imagen: {
    width: 100,
    height: 100,
    opacity: 1,
  },
});

