import {useState} from 'react';
import Notify from './Notify';
const NotifyContainer = () => {
      const [visible, setVisible] = useState(true);
    return <>{visible && <Notify setVisible={setVisible} />}</>;
}

export default NotifyContainer;