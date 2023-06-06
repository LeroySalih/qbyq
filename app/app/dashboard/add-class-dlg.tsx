import AddClass, {OnAddHandler} from 'components/add-class';
import { Class } from 'types/alias';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';


type ClassParam = Class | null | undefined;

type AddClassDlgProps = {
    open: boolean;
    onClose: (value: string) => void;
    onAddClass: (c: ClassParam) => void;
  }
  
  const AddClassDlg = ({open, onClose, onAddClass}: AddClassDlgProps) => {
    return  <Dialog open={open} onClose={onClose}>
              <DialogTitle>Adding Class</DialogTitle>
              <AddClass onAdd={onAddClass} />
            </Dialog>
  }

  export default AddClassDlg;
