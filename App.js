import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet,FlatList, Text, View,SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AntDesign ,MaterialCommunityIcons,MaterialIcons} from '@expo/vector-icons';
import React from 'react';

const COLORS={primary:"#1f145c",white:"#fff"}

export default function App() {
  const [input,setInput]=React.useState('');
  const [todos,setTodos]=React.useState([ ]);

  React.useEffect(()=>{    
      const getData = async () => {
        try {
          const todoss = await AsyncStorage.getItem('Todos')
          if(todoss !==null){
            setTodos(JSON.parse(todoss));
          }
        } catch(e) {
          // error reading value
        }
      };

      getData();
  },[])

  React.useEffect(()=>{

    const storeData = async (todos) => {
      try {
        const stringifiedTods = JSON.stringify(todos)
        await AsyncStorage.setItem('Todos', stringifiedTods)
      } catch (e) {
        // saving error
      }
    };
    
    storeData(todos)

  },[todos])

 const ListItem=({todo})=>{
   return (
   <View style={styles.listItem}>
     <View style={{flex:1}}>
     <Text 
     style={{
       fontWeight:'bold',
       fontSize:20,
       color:COLORS.primary,
       textDecorationLine:todo?.completed?"line-through":"none",
       }}>
         {todo?.task}
       </Text>
       </View>
       {
        !todo?.completed &&(
          <TouchableOpacity
           style={[styles.actionIcon]}
           onPress={()=>markCompleted(todo.id)}
           >
          <View> 
          <AntDesign name="check" size={24} color="white" />
          </View>
         </TouchableOpacity>
         )
       }       

      <TouchableOpacity
       style={[styles.actionIcon]}
       onPress={()=>deleteTodo(todo.id)}
       >
       <View style={{backgroundColor:"red"}}>
       <MaterialCommunityIcons name="trash-can" size={24} color="white" />        
       </View>
      </TouchableOpacity>

   </View>
   );
  }

  
  const addTodo=()=>{
    if(input===''){
      Alert.alert('Error','Please input task')
    }else{
      const newTodo={
        id:Math.random(), 
        task:input,
        completed:false,
      };
      setTodos([...todos,newTodo])
      setInput("")
    }
  }

  const markCompleted=(id)=>{
    const newTodo=todos.map(item=>{
      if(item.id===id){
        return {...item,completed:true}
      }
      return item
    });
    setTodos(newTodo)
  }

  const deleteTodo=(id)=>{
    const newTodo=todos.filter(item=>item.id !==id)
    setTodos(newTodo)
  }
  const clearTodos=()=>{
    Alert.alert('Confirm','clear all todos ?',[
      {
        text:'YES',
        onPress:()=>setTodos([]),
      },
      {text:'NO'},
    ]);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize:24,fontWeight:"bold"}}>Todo App</Text>
        <TouchableOpacity onPress={clearTodos}>
        <MaterialCommunityIcons name="trash-can" size={24} color="red" />        
        </TouchableOpacity>
      </View>

      <FlatList 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{padding:20,paddingBottom:100}}
      data={todos}
      renderItem={({item})=> <ListItem todo={item}/>}
      />
     
      <View style={styles.footer}>
        <View style={styles.inputContainer}>          
        <TextInput
        value={input}
        onChangeText={(text)=>setInput(text)}
         placeholder='Add todo'/>       
        </View>
        <TouchableOpacity onPress={addTodo}>
           <View style={styles.iconConatiner}>
           <MaterialIcons name="add" size={24} color="white" />
           </View>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listItem:{
    padding:20,
    backgroundColor:COLORS.white,
    flexDirection:'row',
    elevation:12,
    borderRadius:7,
    marginVertical:10,
  },
  actionIcon:{
    height:25,
    width:25,
    backgroundColor:"green",
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
    marginHorizontal:5,
  },
  container: {
    marginTop:20,
    flex: 1,
    backgroundColor: COLORS.white,  
  },
  header:{
    padding:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:"space-between"
  },
  footer:{
     position:"absolute",
     bottom:5,
     color:COLORS.white,
     width:"100%",
     flexDirection:"row",
     alignItems:"center",
     paddingHorizontal:20,
  },
  inputContainer:{
    backgroundColor:COLORS.white,
    elevation:40,
    flex:1,
    height:50,
    borderRadius:30,
    padding:10,
  },
  iconConatiner:{
    height:45,
    width:45,
    backgroundColor:COLORS.primary,
    marginLeft:10,
    elevation:40,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:45,
  }
});
