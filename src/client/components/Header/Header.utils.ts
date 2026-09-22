import type { IconType } from 'react-icons'
import { FaCertificate, FaGithub, FaLinkedin } from 'react-icons/fa'
import type { ProfileLink } from '@/client/api/types'

const LINK_ICONS: Readonly<Record<ProfileLink['kind'], IconType>> = {
  GITHUB: FaGithub,
  LINKEDIN: FaLinkedin,
  BADGES: FaCertificate,
}

export const linkIcon = (kind: ProfileLink['kind']): IconType => LINK_ICONS[kind]
