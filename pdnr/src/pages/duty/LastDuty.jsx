import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';

const LastDuty = () => {
  const { user } = useContext(AuthContext);

  console.log(user)

  return (
    <div>LastDuty</div>
  )
}

export default LastDuty