import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof (window) === 'undefined') {
    // we are on the server
    return axios.create({
      // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      baseURL: 'http://ticketing-microsrv-prod.store',
      headers: req.headers
    })
  }
  else {
    // we must be on the browser
    return axios.create({
      baseURL: '/'
    })
  }
}

export default buildClient;