import { Buffer } from 'buffer';
import dgram from 'react-native-udp';

type QueryType = {
  host: string;
  port?: number;
  timeout?: number;
  opcode?: 'i' | 'r' | 'd';
};

export type QueryTypeResponse = {
  passworded: string;
  players: number;
  maxplayers: number;
  hostname: string;
  gamemode: string;
  mapname: string;
};

export const getServerQuery = async (
  options: QueryType,
): Promise<QueryTypeResponse> => {
  const { host, port = 7777, opcode = 'i', timeout = 2000 } = options;

  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket({ type: 'udp4' });
    let closed = false;

    const closeSocket = () => {
      if (closed) return;
      closed = true;
      try { socket.close(); } catch (_) {}
    };

    let packet = Buffer.alloc(10 + opcode.length);
    packet.write('SAMP');
    packet[4] = host.split('.')[0] as unknown as number;
    packet[5] = host.split('.')[1] as unknown as number;
    packet[6] = host.split('.')[2] as unknown as number;
    packet[7] = host.split('.')[3] as unknown as number;
    packet[8] = port & 0xff;
    packet[9] = (port >> 8) & 0xff;
    packet[10] = opcode.charCodeAt(0);

    const timer = setTimeout(() => {
      closeSocket();
      reject(undefined);
    }, timeout);

    socket.on('error', () => {
      clearTimeout(timer);
      closeSocket();
      reject(undefined);
    });

    try {
      socket.bind(() => {
        socket.send(packet, 0, packet.length, port, host, error => {
          if (error) {
            clearTimeout(timer);
            closeSocket();
            return reject(undefined);
          }
        });
      });

      socket.on('message', function (message) {
        clearTimeout(timer);

        try {
          message = message.slice(11);

          let object = {
            passworded: '',
            players: 0,
            maxplayers: 0,
            hostname: '',
            gamemode: '',
            mapname: '',
          };

          let strlen = 0;
          let offset = 0;

          if (opcode === 'i') {
            object.passworded = message.readUInt8(offset);
            offset += 1;
            object.players = message.readUInt16LE(offset);
            offset += 2;
            object.maxplayers = message.readUInt16LE(offset);
            offset += 2;
            strlen = message.readUInt16LE(offset);
            offset += 4;
            object.hostname = decode(message.slice(offset, (offset += strlen)));
            strlen = message.readUInt16LE(offset);
            offset += 4;
            object.gamemode = decode(message.slice(offset, (offset += strlen)));
            strlen = message.readUInt16LE(offset);
            offset += 4;
            object.mapname = decode(message.slice(offset, (offset += strlen)));
          }

          closeSocket();
          return resolve(object);
        } catch (parseErr) {
          closeSocket();
          return reject(undefined);
        }
      });
    } catch (error) {
      clearTimeout(timer);
      closeSocket();
      return reject(undefined);
    }
  });
};

const decode = (buffer: any) => {
  let charset = '';

  for (let i = 0; i < 128; i++) {
    charset += String.fromCharCode(i);
  }

  charset +=
    '€\u0081‚ƒ„…†‡\u0088‰\u008a‹\u008c\u008d\u008e\u008f\u0090\u2018\u2019\u201c\u201d•–—\u0098™\u009a›\u009c\u009d\u009e\u009f\u00a0΅Ά£¤¥¦§¨©\u00aaΆ¬\u00ad®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ\u00d2ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ\u00ff';

  const charsetBuffer = Buffer.from(charset, 'ucs2');
  const decodeBuffer = Buffer.alloc(buffer.length * 2);

  for (let i = 0; i < buffer.length; i++) {
    decodeBuffer[i * 2] = charsetBuffer[buffer[i] * 2];
    decodeBuffer[i * 2 + 1] = charsetBuffer[buffer[i] * 2 + 1];
  }
  return decodeBuffer.toString('ucs2');
};
