import { ISolution } from "../solution";
import { processFile } from "../utils/file-reader";

interface IPacket {
  version: number;
  typeId: number;
}
interface ILiteralPacket extends IPacket {
  typeId: 4;
  value: number;
}
interface IOperatorPacket extends IPacket {
  lengthTypeId: number;
  subPackets: IPacket[];
}

export default class Solution implements ISolution {
  private hexToBinaryArray(hex: string): string[] {
    return hex
      .split("")
      .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
      .join("")
      .split("");
  }
  private parsePacketData(binary: string[]): IPacket {
    const version: number = parseInt(binary.splice(0, 3).join(""), 2);
    const typeId: number = parseInt(binary.splice(0, 3).join(""), 2);
    if (typeId === 4) {
      return this.parseLiteralPacket(version, binary);
    } else {
      return this.parseOperatorPacket(version, typeId, binary);
    }
  }
  private parseLiteralPacket(version: number, payload: string[]): ILiteralPacket {
    const valueBinary: string[] = [];
    let lastPacketProcessed = false;
    while (!lastPacketProcessed) {
      lastPacketProcessed = payload.shift() === "0";
      valueBinary.push(...payload.splice(0, 4));
    }
    const value = parseInt(valueBinary.join(""), 2);
    return {
      version,
      typeId: 4,
      value,
    };
  }
  private parseOperatorPacket(version: number, typeId: number, payload: string[]): IOperatorPacket {
    const lengthTypeId = parseInt(payload.shift() || "0");
    const subPackets: IPacket[] = [];
    if (lengthTypeId === 0) {
      // length in bits of subpackets
      const payloadLength = parseInt(payload.splice(0, 15).join(""), 2);
      const innerPayload = payload.splice(0, payloadLength);
      while (innerPayload.length > 0) {
        subPackets.push(this.parsePacketData(innerPayload));
      }
    } else {
      // count of subpackets
      const subPacketCount = parseInt(payload.splice(0, 11).join(""), 2);
      for (let i = 0; i < subPacketCount; i++) {
        subPackets.push(this.parsePacketData(payload));
      }
    }
    return {
      version,
      typeId,
      lengthTypeId,
      subPackets,
    };
  }
  private isOperatorPacket(packet: IPacket): packet is IOperatorPacket {
    return (packet as IOperatorPacket).subPackets !== undefined;
  }
  private isLiteralPacket(packet: IPacket): packet is ILiteralPacket {
    return (packet as ILiteralPacket).typeId === 4;
  }
  private assert(condition: any): asserts condition {
    if (!condition) {
      throw new Error("Assertion Failed");
    }
  }
  async GetSolutionA(inputFile: string): Promise<string> {
    const data: string[] = [];
    await processFile(inputFile, (line) => {
      data.push(line);
    });
    const binaryInput = this.hexToBinaryArray(data[0]);
    const packet = this.parsePacketData(binaryInput);
    const toVisit: IPacket[] = [packet];
    let versionTotal = 0;
    let currNode: IPacket | undefined;
    while ((currNode = toVisit.pop())) {
      versionTotal += currNode.version;
      if (this.isOperatorPacket(currNode)) {
        toVisit.push(...currNode.subPackets);
      }
    }
    return versionTotal.toString();
  }
  private getPacketValue(packet: IPacket): number {
    if (this.isLiteralPacket(packet)) {
      return packet.value;
    }
    // tells typescript that this definitely is an operatorpacket
    this.assert(this.isOperatorPacket(packet));

    const subpacketValues = packet.subPackets.map((v) => this.getPacketValue(v));
    switch (packet.typeId) {
      case 0: // sum
        return subpacketValues.reduce((acc, curr) => acc + curr, 0);
      case 1: // product
        return subpacketValues.reduce((acc, curr) => acc * curr, 1);
      case 2: // min
        return subpacketValues.reduce(
          (acc, curr) => (curr < acc ? curr : acc),
          Number.MAX_VALUE
        );
      case 3: // max
        return subpacketValues.reduce(
          (acc, curr) => (curr > acc ? curr : acc),
          Number.MIN_VALUE
        );
      case 5: // greater than test
        return subpacketValues[0] > subpacketValues[1] ? 1 : 0;
      case 6: // less than test
        return subpacketValues[0] < subpacketValues[1] ? 1 : 0;
      case 7: // equal to test
        return subpacketValues[0] === subpacketValues[1] ? 1 : 0;
      default:
        throw Error(`Unknown typeId ${packet.typeId}`);
    }
  }
  async GetSolutionB(inputFile: string): Promise<string> {
    const data: string[] = [];
    await processFile(inputFile, (line) => {
      data.push(line);
    });
    const binaryInput = this.hexToBinaryArray(data[0]);
    const packet = this.parsePacketData(binaryInput);

    return this.getPacketValue(packet).toString();
  }
}
