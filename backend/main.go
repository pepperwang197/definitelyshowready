package main

import (
	"fmt"
	"net/http"
)

func metadataHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	fmt.Fprint(w, `
		{
			"songName": "Still",
			"keySignature": "F# maj",
			"timeSignature": "12/8",
			"bpmUnit": "𝅘𝅥.",
			"bpm": "124",
			"duration": 135,
			"filenames": ["Alice.wav", "Alfred.wav", "BackingTrack.wav"]
		}
	`)
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin == "" {
			origin = "http://localhost:5173"
		}
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Vary", "Origin")

		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func newHandler() http.Handler {
	mux := http.NewServeMux()
	fs := http.FileServer(http.Dir("./assets"))

	mux.Handle("/files/", cors(http.StripPrefix("/files/", fs)))
	mux.Handle("/files", cors(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/files/", http.StatusTemporaryRedirect)
	})))
	mux.Handle("/data", cors(http.HandlerFunc(metadataHandler)))

	return mux
}

func main() {
	fmt.Println("starting server")
	http.ListenAndServe(":8080", newHandler())
}
