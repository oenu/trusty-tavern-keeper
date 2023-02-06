import { UnstyledButton, Group, Avatar, Text } from '@mantine/core';
import { forwardRef } from 'react';
import { TbChevronRight } from 'react-icons/tb';
import { NavLink } from 'react-router-dom';

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string;
  name: string;
  discriminator: string;
}

export const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, discriminator, ...others }: UserButtonProps, ref) => (
    <NavLink
      to="/profile"
      style={{
        textDecoration: 'none',
      }}
    >
      <UnstyledButton
        ref={ref}
        sx={(theme) => ({
          display: 'block',
          width: '100%',
          padding: theme.spacing.md,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
        {...others}
      >
        <Group>
          <Avatar src={image} radius="xl" />

          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {name}
            </Text>

            <Text color="dimmed" size="xs">
              {discriminator}
            </Text>
          </div>
          <TbChevronRight size={16} />
        </Group>
      </UnstyledButton>
    </NavLink>
  )
);
