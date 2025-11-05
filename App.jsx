import { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  Button,
  Pressable,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Formulario from './src/components/Formulario';
import Paciente from './src/components/Paciente';
import Informacion from './src/components/InformacionPaciente';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  //   type PacienteType = {
  //   id: string;
  //   paciente: string;
  //   propietario: string;
  //   email: string;
  //   telefono: string;
  //   fecha: Date;
  //   sintomas: string;
  // };

  //Los hooks se colcoan en la parte superior

  const [modalVisible, setModalVisible] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [paciente, setPaciente] = useState({});
  const [modalPaciente, setModalPaciente] = useState(false);


  useEffect(() =>  {
    const obtenerCitasStorage= async () => {
      try {
         const citasStorage = await AsyncStorage.getItem('citas')

         if(citasStorage){
            setPacientes(JSON.parse(citasStorage))
         }
      } catch (error) {
        console.log(error)
      }

    }

    obtenerCitasStorage()
  }, [])



  const pacienteEditar = id => {
    const pacienteEditar = pacientes.filter(paciente => paciente.id === id);

    setPaciente(pacienteEditar[0]);
  };

    const guardarCitasStorage = async (citasJSON) => {
        try {
          await AsyncStorage.setItem('citas', citasJSON)
          
        } catch (error) {
          console.log(error)
        }
  }


  const pacienteEliminar = id => {
    Alert.alert(
      '¿Desea eliminar este paciente?',
      'Un paciente eliminado no se puede recuperar',
      [
        { text: 'Cancelar' },
        {
          text: 'Si, Eliminar',
          onPress: () => {
            const pacienteActualizados = pacientes.filter(
              pacientesState => pacientesState.id !== id,
            );
            setPacientes(pacienteActualizados);
            guardarCitasStorage(JSON.stringify(pacienteActualizados))
          },
        },
      ],
    );
  };

  console.log(paciente)



  const cerrarModal = () => {
    setModalVisible(false)
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>
        Administrador de Citas {''}{' '}
        <Text style={styles.tituloBold}>Veterinaria</Text>{' '}
      </Text>

      <Pressable
        onPress={() => setModalVisible(!modalVisible)}
        style={styles.btnNuevaCita}
      >
        <Text style={styles.btnTextNuevaCita}>Nueva cita</Text>
      </Pressable>

      {pacientes.length === 0 ? (
        <Text style={styles.noPacientes}>No hay pacientes aún</Text>
      ) : (
        <FlatList
          style={styles.listado}
          data={pacientes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <Paciente
                item={item}
                setModalVisible={setModalVisible}
                setPaciente={setPaciente}
                pacienteEditar={pacienteEditar}
                pacienteEliminar={pacienteEliminar}
                setModalPaciente={setModalPaciente}
              />
            );
          }}
        />
      )}


      {modalVisible && (
        <Formulario
        cerrarModal={cerrarModal}
        pacientes={pacientes}
        setPacientes={setPacientes}
        paciente={paciente}
        setPaciente={setPaciente}
        guardarCitasStorage={guardarCitasStorage}
      />)}
      

      <Modal visible={modalPaciente} animationType="fade">
        <Informacion paciente={paciente} setModalPaciente={setModalPaciente} setPaciente={setPaciente}/>
        
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    flex: 1,
  },
  titulo: {
    textAlign: 'center',
    fontSize: 30,
    color: '#374151',
    fontWeight: '600',
  },
  tituloBold: {
    fontWeight: '900',
    color: '#6D28D9',
  },
  btnNuevaCita: {
    backgroundColor: '#6d28d9',
    padding: 15,
    marginTop: 30,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  btnTextNuevaCita: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  noPacientes: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
  },
  listado: {
    marginTop: 50,
    marginHorizontal: 30,
  },
});

export default App;
