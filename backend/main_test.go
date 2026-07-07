package main
package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestFilesEndpointSupportsCORSAndServesAssets(t *testing.T) {
	mux := newHandler()

	req := httptest.NewRequest(http.MethodGet, "/files/Alfred.mid", nil)
	req.Header.Set("Origin", "http://localhost:5173")
	rr := httptest.NewRecorder()

	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d", http.StatusOK, rr.Code)
	}

	if got := rr.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5173" {
		t.Fatalf("expected Access-Control-Allow-Origin header to be set, got %q", got)
	}
}

func TestFilesEndpointHandlesPreflightRequests(t *testing.T) {
	mux := newHandler()

	req := httptest.NewRequest(http.MethodOptions, "/files/Alfred.mid", nil)
	req.Header.Set("Origin", "http://localhost:5173")
	req.Header.Set("Access-Control-Request-Method", http.MethodGet)
	rr := httptest.NewRecorder()

	mux.ServeHTTP(rr, req)

	if rr.Code != http.StatusNoContent {
		t.Fatalf("expected status %d, got %d", http.StatusNoContent, rr.Code)
	}

	if got := rr.Header().Get("Access-Control-Allow-Origin"); got != "http://localhost:5173" {
		t.Fatalf("expected Access-Control-Allow-Origin header to be set, got %q", got)
	}
}
