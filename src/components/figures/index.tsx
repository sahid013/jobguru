import type { ComponentType } from "react";
import { CircularWait, ErdHire, ErGas, Multiprogramming, PageFault } from "./db-os";
import { BfsDfsTrees, BinaryTree, Digraph, PostorderTree } from "./dsa";
import { Cpu8086, FlashAdc, FullAdder, GasSensor, GateCircuit, KMap3, KMap4, Mux2, ParallelCircuit, SerialParallel, TrafficFsm } from "./logic";
import { OsiStack, Scaling, TcpHandshake, WebStack } from "./net";
import { FormPreview, LibraryClasses, PrimeFlow, Waterfall } from "./se-prog";

/**
 * Figures a note can embed by name, written in Markdown as a fenced block:
 *
 *     ```figure
 *     waterfall
 *     ```
 */
export const FIGURES: Record<string, ComponentType> = {
  waterfall: Waterfall,
  "library-classes": LibraryClasses,
  "prime-flow": PrimeFlow,
  "form-preview": FormPreview,
  digraph: Digraph,
  "bfs-dfs-trees": BfsDfsTrees,
  "binary-tree": BinaryTree,
  "postorder-tree": PostorderTree,
  kmap3: KMap3,
  kmap4: KMap4,
  "full-adder": FullAdder,
  "gate-circuit": GateCircuit,
  mux2: Mux2,
  "traffic-fsm": TrafficFsm,
  "parallel-circuit": ParallelCircuit,
  "flash-adc": FlashAdc,
  "serial-parallel": SerialParallel,
  cpu8086: Cpu8086,
  "gas-sensor": GasSensor,
  osi: OsiStack,
  "web-stack": WebStack,
  "tcp-handshake": TcpHandshake,
  scaling: Scaling,
  "er-gas": ErGas,
  "erd-hire": ErdHire,
  "page-fault": PageFault,
  "circular-wait": CircularWait,
  multiprogramming: Multiprogramming,
};
