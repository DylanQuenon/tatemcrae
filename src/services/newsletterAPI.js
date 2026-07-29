import Axios from "axios";
import { NEWSLETTER_API } from "../config";

/**
 * Sends a newsletter to all subscribers
 * @param {Object} data - { subject, content }
 */
function publishNewsletter(data) {
  return Axios.post(`${NEWSLETTER_API}/send`, data).then((response) => response.data);
}

export default {
  publishNewsletter,
};