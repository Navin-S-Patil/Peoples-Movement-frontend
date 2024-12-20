// pages/policies/[type].js
import { useRouter } from 'next/router';
import PolicyPage from '@/components/PolicyPage';

export default function Policy() {
  const router = useRouter();
  const { type } = router.query;

  return <PolicyPage policyType={type} />;
}