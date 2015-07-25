#pragma strict

public class Cannon extends Tower
{
	
	//Overwritten from Tower
	function Start () 
	{
		health = 100;
		max_health = 100;
	}
	
	//Overwritten from Tower
	function increaseLevel()
	{
		var child : Transform = gameObject.transform.Find("Fire Projectile");
		child.GetComponent(TowerAttack).setDamage(child.GetComponent(TowerAttack).getDamage() * 2);
		if (level++ == 1)
		{
			child.GetComponent(TowerAttack).setBurn();
		}
		else
		{
			child.GetComponent(TowerAttack).setMulti();
		}
		mend(1);
	}
}