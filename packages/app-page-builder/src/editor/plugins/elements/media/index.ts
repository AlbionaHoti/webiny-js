import youtube from "./youtube";
import vimeo from "./vimeo";
import soundcloud from "./soundcloud";
import iFrame from "./iframe";

export default [...youtube(), ...vimeo(), ...soundcloud(), ...iFrame()];
