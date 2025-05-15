"use client";
import {
  Map as GoogleMap,
  APIProvider,
  AdvancedMarker,
  useAdvancedMarkerRef,
  Pin,
} from "@vis.gl/react-google-maps";
import { env } from "@/config/env";

type Coordinates = {
  lat: number;
  lng: number;
};

export const Map: React.FC<{
  postiton: Coordinates;
  marker: Coordinates;
  zoom: number;
}> = (p) => {
  const position = {
    lat: p.postiton.lat || 40.158804,
    lng: p.postiton.lng || -105.0266637,
  };

  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS}>
      <GoogleMap
        defaultCenter={position}
        defaultZoom={p.zoom || 10}
        reuseMaps={true}
        mapId="bab2c686d30531e986bf83be"
      >
        <MapMarker {...p.marker} />
      </GoogleMap>
    </APIProvider>
  );
};

export const MapMarker: React.FC<Coordinates> = (p) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{
          lat: p.lat,
          lng: p.lng,
        }}
      >
        <Pin
          background={"#ffffff"}
          borderColor={"#ffffff"}
          glyphColor={"#000000"}
        />
      </AdvancedMarker>
    </>
  );
};
