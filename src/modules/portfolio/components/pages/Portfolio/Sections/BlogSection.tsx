import { PostMetadata } from '@/blog/types/PostMetadata'
import { List } from '@chakra-ui/react'
import { FC } from 'react'
import Section from './Section'
import SectionListLink from './SectionListLink'

type Props = {
  posts: PostMetadata[]
}

const BlogSection: FC<Props> = ({ posts }) => {
  return (
    <Section title="Recent Posts">
      <List w={'full'}>
        {posts.map(({ createdAt, description, slug, title }) => (
          <SectionListLink
            key={slug}
            item={{
              date: createdAt,
              description,
              title: <SectionListLink.Title>{title}</SectionListLink.Title>,
              url: `/blog/posts/${slug}`,
            }}
            target={'_self'}
          />
        ))}
      </List>
    </Section>
  )
}

export default BlogSection
