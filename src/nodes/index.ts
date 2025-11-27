import MessageNode from './MessageNode';
import ConditionNode from './ConditionNode';
import TargetNode from './TargetNode';
import PortScanNode from './PortScanNode';
import PhishingNode from './PhishingNode';
import PayloadNode from './PayloadNode';
import C2Node from './C2Node';

export const nodeTypes = {
  message: MessageNode,
  condition: ConditionNode,
  target: TargetNode,
  'port-scan': PortScanNode,
  phishing: PhishingNode,
  payload: PayloadNode,
  c2: C2Node,
};
