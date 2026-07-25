import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';

const App = (props: any) => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Coordenadas del punto de encuentro (valor por defecto: centro de Quito)
  const lat = parseFloat(props.latitud_encuentro) || -0.180653;
  const lng = parseFloat(props.longitud_encuentro) || -78.467834;

  // HTML con Leaflet.js usando OpenStreetMap (sin API Key)
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${lat}, ${lng}], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Punto de Encuentro (marcador rojo)
        L.marker([${lat}, ${lng}])
          .addTo(map)
          .bindPopup('<b>Punto de Encuentro</b><br>Lugar de inicio de la actividad')
          .openPopup();

        // Policía (marcador azul)
        var policeIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
        });
        L.marker([${lat + 0.003}, ${lng + 0.002}], {icon: policeIcon})
          .addTo(map)
          .bindPopup('<b>Policía</b><br>Unidad de Policía Comunitaria');

        // Hospital (marcador verde)
        var hospitalIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
        });
        L.marker([${lat - 0.002}, ${lng + 0.004}], {icon: hospitalIcon})
          .addTo(map)
          .bindPopup('<b>Hospital</b><br>Centro de Salud Cercano');

        // Punto Seguro (marcador naranja)
        var safeIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]
        });
        L.marker([${lat - 0.004}, ${lng - 0.003}], {icon: safeIcon})
          .addTo(map)
          .bindPopup('<b>Punto Seguro</b><br>Zona segura para turistas');
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>SEGURIDAD Y CHECK-IN</Text>

        {/* Mapa OpenStreetMap con Leaflet.js */}
        <View style={styles.mapContainer}>
          <WebView
            source={{ html: mapHtml }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>

        <Text style={styles.subHeader}>Detalles del Viaje</Text>

        <View style={styles.card}>
          <Text style={styles.label}>ID Turista</Text>
          <Text style={styles.value}>{props.id_turista || 'N/A'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Restaurante</Text>
          <Text style={styles.value}>{props.nombre_restaurante || 'N/A'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Hora de reserva</Text>
          <Text style={styles.value}>{props.hora_reserva || 'N/A'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Actividad</Text>
          <Text style={styles.value}>{props.nombre_actividad || 'N/A'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Costo actividad</Text>
          <Text style={styles.value}>
            {props.costo_actividad != null ? `$${props.costo_actividad}` : 'N/A'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tipo de transporte</Text>
          <Text style={styles.value}>{props.tipo_transporte || 'N/A'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Estación origen</Text>
          <Text style={styles.value}>{props.estacion_origen || 'N/A'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Estación destino</Text>
          <Text style={styles.value}>{props.estacion_destino || 'N/A'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Costo total acumulado</Text>
          <Text style={styles.value}>
            {props.costo_total_acumulado != null ? `$${props.costo_total_acumulado}` : 'N/A'}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Estado:</Text>
          <Text style={[styles.statusValue, isCheckedIn ? styles.statusSuccess : styles.statusPending]}>
            {isCheckedIn ? 'Check-in realizado' : 'Pendiente'}
          </Text>
        </View>

        {!isCheckedIn ? (
          <View style={styles.buttonContainer}>
            <Button title="Realizar Check-in" onPress={() => setIsCheckedIn(true)} />
          </View>
        ) : (
          <View style={styles.finalLogContainer}>
            <Text style={styles.successMessage}>Viaje finalizado correctamente.</Text>

            {/* Bitácora Final */}
            <View style={styles.logCard}>
              <Text style={styles.logHeader}>BITÁCORA FINAL</Text>
              <Text style={styles.logText}>Turista: {props.id_turista || 'N/A'}</Text>
              <Text style={styles.logText}>Restaurante: {props.nombre_restaurante || 'N/A'}</Text>
              <Text style={styles.logText}>Actividad: {props.nombre_actividad || 'N/A'}</Text>
              <Text style={styles.logText}>Transporte: {props.tipo_transporte || 'N/A'}</Text>
              <Text style={styles.logText}>
                Costo total:{' '}
                {props.costo_total_acumulado != null ? `$${props.costo_total_acumulado}` : 'N/A'}
              </Text>
              <Text style={[styles.logText, styles.logFinalStatus]}>
                Estado del viaje: Finalizado
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#444',
  },
  mapContainer: {
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  map: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusPending: {
    color: '#ff9800',
  },
  statusSuccess: {
    color: '#4caf50',
  },
  successMessage: {
    fontSize: 16,
    color: '#4caf50',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  finalLogContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  logCard: {
    backgroundColor: '#e8f5e9',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  logHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 15,
  },
  logText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  logFinalStatus: {
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 10,
  },
});

export default App;
