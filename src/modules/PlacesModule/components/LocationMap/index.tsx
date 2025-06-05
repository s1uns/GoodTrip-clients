import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
	latitude: number;
	longitude: number;
	locationName?: string;
};

const LocationMap = ({ latitude, longitude, locationName = "You" }: Props) => (
	<MapContainer
		center={[latitude, longitude]}
		zoom={13}
		className="h-72 w-full z-0"
	>
		<TileLayer
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			attribution="&copy; OpenStreetMap"
		/>
		<Marker position={[latitude, longitude]}>
			<Popup>{locationName}</Popup>
		</Marker>
	</MapContainer>
);

export default LocationMap;
