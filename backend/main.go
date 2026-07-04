package main

import (
	"fmt"
	"net/http"
)

func midiHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")

	http.ServeFile(w, r, "./assets/Still.mid")
}

func audioHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")

	http.ServeFile(w, r, "./assets/Still.wav")
}


func metadataHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")

	w.Header().Set("Content-Type", "application/json")

	fmt.Fprint(w, `
		{
			"songName": "Still",
	 		"keySignature": "F# maj",
	 		"timeSignature": "12/8",
	 		"bpm": "dotted quarter = 124",
	 		"duration": 135,
	 		"filenames": ["Alice.wav", "Alfred.wav", "Still.wav"]
		}
	`)
}


func main() {

	fs := http.FileServer(http.Dir("./assets"))
	
	// Assign the file server to handle the root path
	http.Handle("/files", fs)
	
	fmt.Println("starting server")
	
	// http.HandleFunc("/midi", midiHandler)
	// http.HandleFunc("/backing", audioHandler)
	// http.HandleFunc("/data", metadataHandler)
	http.ListenAndServe(":8080", nil)
	
}
