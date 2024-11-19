<h2>Reset password</h2>
<form method="POST">
    @csrf
    <input type="password" name="password" placeholder="New password">
    <button type="submit">Reset password</button>
</form>
