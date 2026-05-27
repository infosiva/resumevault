import { getContentOverrides } from '@/lib/content'
import ResumeVaultPage from './ResumeVaultPage'

export default async function Page() {
  const overrides = await getContentOverrides()
  return <ResumeVaultPage overrides={overrides} />
}
