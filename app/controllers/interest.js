/* eslint-disable quote-props */
import pool from '../migrate';

class interestController {
  static async createInterest(req, res) {
    const { office, party } = req.body;
    const getUser = 'Select * from users where id= $1 AND registeras =$2';
    const checkPolitician = await pool.query(getUser, [req.user.id, 'politician']);
    if (!checkPolitician.rows[0]) {
      return res.status(404).json({
        'status': 404,
        'error': 'User is not a politician',
      });
    }
    const values = [office, party, req.user.id];
    const sendInterest = `INSERT INTO interests (office, party, interest)
    VALUES($1, $2 ,$3 )`;
    const selectUserInterest = 'Select * from interests where interest = $1 , office = $2';
    const AllUserInterest = await pool.query(selectUserInterest, [req.user.id, office]);
    if (AllUserInterest.rows[0] !== null) {
      return res.status(400).json({
        'status': 400,
        'error': 'You have already expressed Interest to run fot this office',
      });
    }
    try {
      /**
          * Add the interest to  the database
          * create a unique Id
          * @return {object} - The interest object
            */
      await pool.query(sendInterest, values);
      const selectInterest = 'Select * from interests';
      const AllInterests = await pool.query(selectInterest);
      return res.status(201).json({
        'status': 201,
        'data': AllInterests.rows[AllInterests.rowCount - 1],
      });
    } catch (err) {
      return res.status(501).json({
        'status': 501,
        'error': err.toString(),
      });
    }
  }

  static async editInterest(req, res) {

    const id = Number(req.params.id);
    // eslint-disable-next-line prefer-destructuring
    const {
      office, party,
    } = req.body;

    try {

      const getUserInterests = 'Select * from interests where interest=$1 and id =$2';
      const { rows } = await pool.query(getUserInterests, [req.user.id, id]);
      if (!rows[0]) {
        return res.status(401).json({
          'status': 401,
          'error ': 'Interest not found',
        });
      }
      const updateInterest = 'Update interests SET office = $1 , party =$2 where id = $3 returning *';
      const values = [office || rows[0].office, party || rows[0].party, id];
      const updatedInterest = await pool.query(updateInterest, values);
      return res.status(201).json({
        'status': 201,
        'data': updatedInterest.rows[0],
      });
    } catch (err) {
      return res.status(501).json({
        'status': 501,
        'error': err.toString(),
      });
    }
  }

  static async getInterest(req, res) {
    try {
      const getAllInterests = 'Select * from interests';
      const getAllUsers = 'SELECT * from users where id = $1';
      const getuserinterests = 'SELECT * from interests where interest =$1';
      if (req.user.isAdmin === true) {
        const { rows } = await pool.query(getAllInterests);
        const data = [];
        for (let i = 0; i < rows.length; i++) {
          const users = await pool.query(getAllUsers, [rows[i].interest]);
          data.push({
            user: users.rows[0].id,
            username: `${users.rows[0].firstname} ${users.rows[0].lastname} ${users.rows[0].othername}`,
            passport: users.rows[0].passporturl,
            interestId: rows[i].id,
            office: rows[i].office,
            party: rows[i].party,
          });
        }
        return res.status(200).json({
          'status': 200,
          data,
        });
      }
      const newRows = await pool.query(getuserinterests, [req.user.id]);
      if (!newRows.rows[0]) {
        return res.status(401).json({
          'status': 401,
          'error': 'Unauthorized',
        });
      }
      return res.status(200).json({
        'status': 200,
        'data': newRows.rows,
      });
    } catch (err) {
      return res.status(500).json({
        'status': 500,
        'error': err.toString(),
      });
    }
  }

  static async deleteInterest(req, res) {
    const id = Number(req.params.id);
    const getInterests = 'Select * from interests where id =$1 and interest=$2';
    const { rows } = await pool.query(getInterests, [id, req.user.id]);
    if (!rows[0]) {
      return res.status(404).json({
        'status': 404,
        'error': 'Interest not found',
      });
    }
    const deleting = 'Delete from interests where id=$1';
    try {
      await pool.query(deleting, [id]);
      return res.status(200).json({
        'status': 200,
        'data': {
          'message': 'interests deleted succesfully',
        },
      });
    } catch (err) {
      return res.status(501).json({
        'status': 501,
        'error': err.toString(),
      });
    }
  }
}
export default interestController;