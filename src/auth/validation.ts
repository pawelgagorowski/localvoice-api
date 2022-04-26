import { z } from 'zod';

export const SignInUserRequestValid = z.object({
  email: z
    .string({
      required_error: 'email is required',
    })
    .nonempty({
      message: "email can't be empty",
    }),
  password: z
    .string({
      required_error: 'password is required',
    })
    .nonempty({
      message: "password can't be empty",
    }),
});

export const SignUpUserRequestValid = z
  .object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .nonempty({
        message: "email can't be empty",
      })
      .email(),
    password: z
      .string({
        required_error: 'password is required',
      })
      .nonempty({
        message: "pasword can't be empty",
      }),
    confirm: z.string({
      required_error: 'password confirmation is required',
    }),
    business: z
      .string({
        required_error: 'company name is required',
      })
      .nonempty({
        message: "company name can't be empty",
      }),
    language: z
      .string({
        required_error: 'language is required',
      })
      .nonempty({
        message: "language can't be empty",
      }),
    firstName: z
      .string({
        required_error: 'first name is required',
      })
      .nonempty({
        message: "username can't be empty",
      }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'], // path of error
  });

export const RefreshTokenRequestValid = z.object({
  userId: z
    .string({
      required_error: 'userId is required',
    })
    .nonempty({
      message: "userId can't be empty",
    }),
  refreshToken: z
    .string({
      required_error: 'refresh token is required',
    })
    .nonempty({
      message: "refresh token can't be empty",
    }),
});

export const AuthTokenClaimsvalid = z.object({
  userId: z
    .string({
      required_error: 'userId is required',
    })
    .nonempty({
      message: "userId can't be empty",
    }),
  email: z
    .string({
      required_error: 'email is required',
    })
    .email(),
  business: z
    .string({
      required_error: 'business is required',
    })
    .nonempty({
      message: "company name can't be empty",
    }),
});
