const gql = require('graphql-tag');

const { createTestServer } = require('test-util');

const POSTS_QUERY = gql`
  {
    posts {
      id
      title
      slug
      body
      video
      image {
        file {
          url
          details {
            image
          }
          type
        }
      }
    }
  }
`;

describe('queries', () => {
  test('posts', async () => {
    const { query } = createTestServer({
      sources: {
        contentfulAPI: {
          getEntries: jest.fn(() => ({
            items: [
              {
                sys: {
                  id: 1,
                },
                fields: {
                  title: 'title1',
                  slug: 'title-1',
                  body: 'lorem ipsum',
                  videoLink: 'testing.mp4',
                  image: {
                    file: {
                      url: 'http://img.png',
                      details: {
                        image: {},
                      },
                      type: 'png',
                    },
                  },
                },
              },
            ],
          })),
        },
      },
    });

    const expecting = [
      {
        id: '1',
        title: 'title1',
        slug: 'title-1',
        body: 'lorem ipsum',
        video: 'testing.mp4',
        image: {
          file: { url: 'http://img.png', details: { image: {} }, type: 'png' },
        },
      },
    ];
    const { data } = await query({ query: POSTS_QUERY });
    expect(JSON.parse(JSON.stringify(data.posts))).toMatchObject(expecting);
  });
});
