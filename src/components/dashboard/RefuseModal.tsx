import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RefuseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RefuseModal = ({ open, onOpenChange }: RefuseModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Recusar Vaga</DialogTitle>
        <DialogDescription>Por favor, informe o motivo da recusa para ajudar a melhorar o programa.</DialogDescription>
      </DialogHeader>
      <Select>
        <SelectTrigger className="h-12 rounded-lg">
          <SelectValue placeholder="Selecione o motivo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="other-job">Já consegui outro emprego</SelectItem>
          <SelectItem value="location">Localização incompatível</SelectItem>
          <SelectItem value="schedule">Horário incompatível</SelectItem>
          <SelectItem value="personal">Motivos pessoais</SelectItem>
          <SelectItem value="other">Outro motivo</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-3 mt-2">
        <Button variant="outline" className="flex-1 rounded-lg" onClick={() => onOpenChange(false)}>Cancelar</Button>
        <Button className="flex-1 bg-destructive text-destructive-foreground rounded-lg" onClick={() => onOpenChange(false)}>Confirmar Recusa</Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default RefuseModal;
