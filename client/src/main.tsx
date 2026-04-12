import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './layaut/index.css'
import {Root} from "./routes/Root.tsx";
import {Provider} from "react-redux";
import {store} from "./store/store.ts";
import {ToastContainer} from "react-toastify";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <ToastContainer position="bottom-right" theme='colored'/>
      <Root />
      </Provider>
  </StrictMode>
)
