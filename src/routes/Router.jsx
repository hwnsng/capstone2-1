import * as R from '@/allFiles'
import { Routes, Route } from 'react-router-dom';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<R.Main />} />
      <Route path="/chat" element={<R.Chat />} />
      <Route path="/aichat" element={<R.AI />} />
      <Route path="/community" element={<R.Community />} />
      <Route path="/communitycreate" element={<R.CommunityCreate />} />
      <Route path="/community/:id" element={<R.CommunityDetail />} />
      <Route path="/house" element={<R.House />} />
      <Route path="/housecreate" element={<R.HouseCreate />} />
      <Route path="/housedetail/:id" element={<R.HouseDetail />} />
      <Route path="/mentolist" element={<R.MentoList />} />
      <Route path="/mentocreate" element={<R.MentoCreate />} />
      <Route path="/mentodetail/:id" element={<R.MentoDetail />} />
      <Route path="/policy" element={<R.Policy />} />
      <Route path="/policydetail/:id" element={<R.PolicyDetail />} />
      <Route path="/signin" element={<R.Signin />} />
      <Route path="/signup" element={<R.Signup />} />
      <Route path="/profile" element={<R.Profile />} />
      <Route path="/changepasswd" element={<R.ChangePasswd />} />
      <Route path="/changeemail" element={<R.ChangeEmail />} />
      <Route path="/changemento" element={<R.ChangeMento />} />
    </Routes>
  );
}

export default Router;