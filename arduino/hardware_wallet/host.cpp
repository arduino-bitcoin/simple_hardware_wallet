#include "host.h"
#include <Arduino.h>

int Host::error(const char * message){
	int l = stream->print("error: ");
	l += stream->println(message);
	return l;
}
int Host::success(const char * message){
	int l = stream->print("success: ");
	l += stream->println(message);
	return l;
}
int Host::success(const String &s){
	int l = stream->print("success: ");
	l += stream->println(s);
	return l;
}
