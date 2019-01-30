import parties from '../models/party';
/** Class representing controllers for parties endpoints */

class partyController {
  /**
  * Create an office
  * @param {string} - name of office
  * @param {string} - hqAddress of office
  */

  static createParty(req, res) {
    const {id, name, AKA, hqAddress, logoUrl} = req.body;
      // check if name is provided
    if (!name) {
      return res.status(412).send({
        status: 412,
        error: ' name is required'
      });
    }
    // check if
    if(/^[a-zA-Z]+$/.test(name)===false){
      return res.status(406).send({
        status:406,
        error: 'name must be alphabets only'
      })
    }
    // check if headquaters address is provided
    if (!hqAddress) {
      return res.status(412).send({
        status: 412,
        error: "Headquaters's address is required"
      });
    }
    const party = {
      id: parties.length + 1,
      name: name,
      AKA: AKA,
      hqAddress: hqAddress,
      logoUrl: logoUrl
    };
    /**

    * Add the part object to the the data array
    * create an  unique id
    * @return {object} - The party object

    */
    parties.push(party);
    return res.status(201).send({
      status: 201,
      data: party,
      message: 'You have added a political party'
    });
  }
}

export default partyController;