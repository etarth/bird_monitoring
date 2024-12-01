#include <WiFi.h>
#include <FirebaseESP32.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ESP32Servo.h>
#include <HX711.h>


//================================== Configuration ==================================
// WiFi
const char* ssid = "";
const char* password = "";
// Firebase
const char* firebaseHost = "";
const char* firebaseAuth = "";
// Google Sheets Webhook
const char* webhookUrl = "";
// Sensors
#define SERVO_PIN 13
Servo myServo;
#define DHTPIN 21
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
#define RELAY_PIN 23
#define HX711_DOUT 25
#define HX711_SCK 26
HX711 scale;
#define LDR_PIN 32
#define BUTTON_PIN 33
#define WATER_LEVEL_PIN 34


//================================== Set Up ==================================
void setup() {
  Serial.begin(115200);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");

  // Set Up for DHT11
  dht.begin();
  // Set Up for Relay
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
  // Set Up for Button
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  // Set Up for Servo
  myServo.attach(SERVO_PIN);
  myServo.write(0);
  // Set Up for HX711
  scale.begin(HX711_DOUT, HX711_SCK);
  scale.set_scale(2280.f);
  scale.tare();
}

void sendToFirebase(int waterLevel, int lightLevel, float temperature, float humidity, float foodWeight) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String firebaseUrl = String(firebaseHost) + "/data.json?auth=" + firebaseAuth;

    // Create JSON Payload
    String jsonPayload = "{\"waterLevel\":" + String(waterLevel) +
                         ",\"lightLevel\":" + String(lightLevel) +
                         ",\"temperature\":" + String(temperature) +
                         ",\"humidity\":" + String(humidity) + 
                         ",\"foodWeight\":" + String(foodWeight) + "}";

    // Send POST Request
    http.begin(firebaseUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.PUT(jsonPayload);

    // Check Response
    if (httpResponseCode > 0) {
      Serial.println("Data sent to Firebase successfully: " + String(httpResponseCode));
    } else {
      Serial.println("Failed to send data to Firebase: " + String(httpResponseCode));
    }
    http.end();
  } else {
    Serial.println("WiFi not connected.");
  }
}

void sendToGoogleSheets(int waterLevel, int lightLevel, float temperature, float humidity, float foodWeight) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Create JSON Payload
    String jsonPayload = "{\"waterLevel\":" + String(waterLevel) +
                         ",\"lightLevel\":" + String(lightLevel) +
                         ",\"temperature\":" + String(temperature) +
                         ",\"humidity\":" + String(humidity) + 
                         ",\"foodWeight\":" + String(foodWeight) + "}";

    // Send POST Request
    http.begin(webhookUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonPayload);

    // Check Response
    if (httpResponseCode > 0) {
      Serial.println("Data sent to Google Sheets successfully: " + String(httpResponseCode));
    } else {
      Serial.println("Failed to send data to Google Sheets: " + String(httpResponseCode));
    }
    http.end();
  } else {
    Serial.println("WiFi not connected.");
  }
}


//================================== Main ==================================
void loop() {
  // Read Sensors
  int waterLevel = analogRead(WATER_LEVEL_PIN);
  int lightLevel = analogRead(LDR_PIN);
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  float foodWeight = scale.get_units(10);

  // Control Water Pump
  if (waterLevel < 100) {
    digitalWrite(RELAY_PIN, LOW);
    Serial.println("Turn ON Water Pump");
  } else {
    digitalWrite(RELAY_PIN, HIGH);
    Serial.println("Turn OFF Water Pump");
  }

  // Control Servo
  if (digitalRead(BUTTON_PIN) == HIGH) {
    Serial.println("Button pressed! Rotating servo to 180 degrees");
    myServo.write(180);
    delay(4000);
    Serial.println("Returning servo to 0 degrees");
    myServo.write(0);
  }

  // Print Sensor Data
  Serial.printf("Water Level: %d, Light Level: %d, Temp: %.2f, Humidity: %.2f, foodWeight: %.2f\n", 
                 waterLevel, lightLevel, temperature, humidity, foodWeight);
  // Send Data to Firebase
  sendToFirebase(waterLevel, lightLevel, temperature, humidity, foodWeight);
  // Send Data to Google Sheets
  sendToGoogleSheets(waterLevel, lightLevel, temperature, humidity, foodWeight);

  delay(5000);
}