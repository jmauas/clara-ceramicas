import * as React from 'react';
import { Transition } from 'react-transition-group';
import { styled } from '@mui/system';
import { Snackbar } from '@mui/base/Snackbar';
import { FaTimesCircle, FaCheckCircle, FaInfoCircle} from "react-icons/fa";

export default function Toast( { show, setShow, props }) {
  const [exited, setExited] = React.useState(true);
  const nodeRef = React.useRef(null);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShow(false);
  };

  const handleOnEnter = () => {
    setExited(false);
  };

  const handleOnExited = () => {
    setExited(true);
  };

  return (
    <StyledSnackbar
        autoHideDuration={5000}
        open={show}
        onClose={handleClose}
        exited={exited}
      >
        <Transition
          timeout={{ enter: 400, exit: 400 }}
          in={show}
          appear
          unmountOnExit
          onEnter={handleOnEnter}
          onExited={handleOnExited}
          nodeRef={nodeRef}
        >
          {(status) => (
            <SnackbarContent
              style={{
                transform: positioningStyles[status],
                transition: 'transform 300ms ease',
                backgroundColor: props.tema === 'ok' ? '#caffbf' : props.tema === 'error' ? '#fec5bb' : '#90e0ef',
                fontFamily: 'Verdana, Geneva, sans-serif',
                border: `1px solid ${props.tema === 'ok' ? '#678d58' : props.tema === 'error' ? '#ff0000' : '#580aff'}`,
              }}
              ref={nodeRef}              
            >
              
              <div className="snackbar-message">
                <div className={`flex flex-row place-content-between items-center text-xl font-bold ${props.tema === 'ok' ? 'text-green-600' : props.tema === 'error' ? 'text-red-600' : 'text-blue-600'}`}
                >
                    <p className={`snackbar-title`}>{props.titulo}</p>
                    <span className="snackbar-close-icon" onClick={handleClose}>
                      {props.tema === 'ok' 
                      ? <FaCheckCircle size="2rem"/> 
                      : props.tema === 'error' 
                        ? <FaTimesCircle size="2rem"/>
                        : <FaInfoCircle size="2rem"/>
                      }
                    </span>
                </div>
                <p className={`${props.tema === 'ok' ? 'text-green-600' : props.tema === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
                  {props.mensaje}
                </p>
              </div>
              
            </SnackbarContent>
          )}
        </Transition>
    </StyledSnackbar>
  );
}

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const blue = {
  200: '#99CCF3',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};


const StyledSnackbar = styled(Snackbar)`
  position: fixed;
  z-index: 5500;
  display: flex;
  bottom: 16px;
  right: 16px;
  max-width: 560px;
  min-width: 300px;
`;

const SnackbarContent = styled('div')(
  ({ theme }) => `
  display: flex;
  gap: 8px;
  overflow: hidden;
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? `0 2px 16px rgba(0,0,0, 0.5)`
      : `0 2px 16px ${grey[200]}`
  };
  padding: 0.75rem;
  color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  text-align: start;
  position: relative;

  & .snackbar-message {
    flex: 1 1 0%;
    max-width: 100%;
  }

  & .snackbar-title {
    margin: 0;
    line-height: 1.5rem;
    margin-right: 0.5rem;
  }

  & .snackbar-description {
    margin: 0;
    line-height: 1.5rem;
    font-weight: 400;
    color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
  }

  & .snackbar-close-icon {
    cursor: pointer;
    flex-shrink: 0;
    padding: 2px;
    border-radius: 4px;

    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    }
  }
  `,
);

const positioningStyles = {
  entering: 'translateX(0)',
  entered: 'translateX(0)',
  exiting: 'translateX(500px)',
  exited: 'translateX(500px)',
  unmounted: 'translateX(500px)',
};