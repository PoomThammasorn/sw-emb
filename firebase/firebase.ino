#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <SoftwareSerial.h>

// Config Firebase
#define FIREBASE_HOST "embedded-swa-ver2-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_AUTH "yRDUNxiZdwlmTf98Ct4ReLM5Su2U4WHcEQk66EZJ"

// Config connect WiFi
#define WIFI_SSID "Thammasorn"
#define WIFI_PASSWORD "poom9902"

const byte RX = D7;
const byte TX = D6;
SoftwareSerial mySerial(RX, TX);
String a, l, h, t, light, temp, humid;
char inCh = ' ';
int tL, tT, tH, tE;

void setup() {
  Serial.begin(9600);
  mySerial.begin(9600);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  Serial.print("Connecting: ");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("||");
    delay(1000);
  }
  Serial.print("\nConnected!!! IP: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  while (Firebase.failed()) {
    Serial.println("Init failed!");
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  }
}

void loop() {
  if (Firebase.failed()) {
    Serial.println("Firebase failed...");
    Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  }

  Get_Data();
  
  Serial.print("light: " + light);
  Serial.print(", humidity: " + humid);
  Serial.println(", temperature: " + temp);

  Firebase.setInt("dataTable/light", light.toInt());
  Firebase.setInt("dataTable/humidity", humid.toInt());
  Firebase.setInt("dataTable/temp", temp.toInt());
  
  if (Firebase.failed()) {
    Serial.print("Get Data failed...");
    Serial.println(Firebase.error());
    return;
  }

}

void Get_Data() {
  while (mySerial.available()) {
    inCh = (char)mySerial.read();
    if (inCh == '\n') {
      tL = a.indexOf("L");
      tT = a.indexOf("T");
      tH = a.indexOf("H");
      tE = a.indexOf("E");
      
      l = a.substring(1+tL, tT);
      t = a.substring(1+tT, tH);
      h = a.substring(1+tH, tE);
     
      a = "";

      if (l != "") {
        light = l;
      }
      if (h != "") {
        humid = h;
      }
      if (t != "") {
        temp = t;
      }

      return;
    }
    
    if (a.length() > 15) {
      a = "";
    } else {
      a += inCh;
    }  
  }
  
  delay(1000);
}
